from langchain_core.tools import tool

@tool
def get_business_hours() -> str:
    """Retorna los horarios de atención de la tienda."""
    return "Abrimos de lunes a sábado de 9:00 a 20:00 hs. Domingos cerrado."

@tool
def get_location() -> str:
    """Retorna la ubicación y dirección física de la tienda."""
    return "Nuestra tienda principal está ubicada en Av. del Libertador 1234, Ciudad Autónoma."
