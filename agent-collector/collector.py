import psutil
import time
import requests
from datetime import datetime

SERVIDOR_ID = "BRAYAN-PC-01"
BACKEND_URL = "http://localhost:8085/api/metricas"

def obtener_metricas():
    """Obtiene las métricas actuales del sistema (CPU, RAM, Disco)."""
    cpu_usage = psutil.cpu_percent(interval=0.1)
    ram_info = psutil.virtual_memory()
    ram_usage = ram_info.percent
    disk_info = psutil.disk_usage('/')
    disk_usage = disk_info.percent
    
    return {
        "servidorId": SERVIDOR_ID,
        "timestamp": datetime.now().isoformat(),
        "cpu": cpu_usage,
        "ram": ram_usage,
        "disco": disk_usage
    }

def enviar_metricas_al_backend(metricas):
    """Envía las métricas recolectadas a la API REST de Spring Boot."""
    try:
        headers = {'Content-Type': 'application/json'}
        response = requests.post(
            url=BACKEND_URL, 
            json=metricas, 
            headers=headers,
            timeout=2
        )
        response.raise_for_status()
        print("   ✅ [INFO] Métricas guardadas en BD (Spring Boot) correctamente.")
    except requests.exceptions.ConnectionError:
        print("   ⏳ [WARN] Servidor Java no disponible. Esperando conexión...")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ [ERROR] Fallo al enviar métricas: {e}")

def main():
    print("==================================================")
    print("🛡️  CENTINELA TI - AGENTE RECOLECTOR INICIADO   🛡️")
    print("==================================================\n")
    
    while True:
        try:
            metricas = obtener_metricas()
            
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 📊 NUEVA LECTURA:")
            print(f"   💻 CPU:   {metricas['cpu']:>5.1f} %")
            print(f"   🧠 RAM:   {metricas['ram']:>5.1f} %")
            print(f"   💽 DISCO: {metricas['disco']:>5.1f} %")
            
            # Llamamos al backend para persistir los datos
            enviar_metricas_al_backend(metricas)
            print("-" * 50)
            
            time.sleep(5)
            
        except KeyboardInterrupt:
            print("\n🛑 [INFO] Agente detenido por el usuario. Apagando Centinela...")
            break
        except Exception as e:
            print(f"\n⚠️ [ERROR] Ocurrió un fallo en la recolección: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
