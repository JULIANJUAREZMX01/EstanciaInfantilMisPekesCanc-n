use wasm_bindgen::prelude::*;

/// Calcula la física de las burbujas dado el tiempo transcurrido en segundos.
/// Devuelve la nueva posición vertical (en píxeles) desde la base.
#[wasm_bindgen]
pub fn calcular_fisicas_burbujas(velocidad: f64, tiempo: f64) -> f64 {
    velocidad * tiempo
}

/// Verifica si dos colores son iguales (comparación de cadenas hexadecimales).
#[wasm_bindgen]
pub fn colores_iguales(color_a: &str, color_b: &str) -> bool {
    color_a.eq_ignore_ascii_case(color_b)
}
