use std::sync::Arc;

use axum::{
    routing::{get, post},
    Router,
};

use crate::{
    handler::{create_paste_handler, get_paste_handler},
    AppState,
};

pub fn create_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/paste", post(create_paste_handler))
        .route("/paste/:id", get(get_paste_handler))
        .with_state(app_state)
}
