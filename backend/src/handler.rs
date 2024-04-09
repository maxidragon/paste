use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::json;

use crate::{
    model::{PasteModel, PasteModelResponse},
    schema::CreatePasteSchema,
    AppState,
};

pub async fn create_paste_handler(
    State(data): State<Arc<AppState>>,
    Json(body): Json<CreatePasteSchema>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let id: String = body.id.unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let query_result = sqlx::query(r#"INSERT INTO pastes (id, title, content) VALUES (?, ?, ?)"#)
        .bind(id)
        .bind(body.title.to_string())
        .bind(body.content.to_string())
        .execute(&data.db)
        .await
        .map_err(|err: sqlx::Error| err.to_string());

    if let Err(err) = query_result {
        if err.contains("Duplicate entry") {
            let error_response = serde_json::json!({
                "status": "error",
                "message": "Paste already exists",
            });
            return Err((StatusCode::CONFLICT, Json(error_response)));
        }

        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"status": "error","message": format!("{:?}", err)})),
        ));
    }

    let paste_response = serde_json::json!({
            "status": "success",
    });

    Ok(Json(paste_response))
}

pub async fn get_paste_handler(
    Path(id): Path<String>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let query_result = sqlx::query_as::<_, PasteModel>(r#"SELECT * FROM pastes WHERE id = ?"#)
        .bind(id)
        .fetch_one(&data.db)
        .await;

    match query_result {
        Ok(paste) => {
            let paste_response = serde_json::json!({
                "status": "success",
                "data": to_paste_response(&paste),
            });

            return Ok(Json(paste_response));
        }
        Err(sqlx::Error::RowNotFound) => {
            return Err((
                StatusCode::NOT_FOUND,
                Json(json!({"status": "error","message": "Paste not found"})),
            ));
        }
        Err(e) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"status": "error","message": format!("{:?}", e)})),
            ));
        }
    };
}

fn to_paste_response(paste: &PasteModel) -> PasteModelResponse {
    PasteModelResponse {
        id: paste.id.to_owned(),
        title: paste.title.to_owned(),
        content: paste.content.to_owned(),
        created_at: paste.created_at.unwrap(),
        updated_at: paste.updated_at.unwrap(),
    }
}
