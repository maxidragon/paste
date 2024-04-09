use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct ParamOptions {
    pub url: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreatePasteSchema {
    pub url: Option<String>,
    pub title: String,
    pub content: String,
}
