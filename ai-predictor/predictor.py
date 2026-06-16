import sys
import io
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import time
import requests
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime

API_URL = "http://localhost:8080/api/metricas/recientes"

def print_cyber_report(current_ram, predicted_ram, minutes_ahead):
    print("\n" + "="*50)
    print("🤖 [CENTINELA AI] - ANÁLISIS PREDICTIVO INICIADO")
    print("="*50)
    print(f"📊 RAM Actual: {current_ram:.2f}%")
    print(f"🔮 Predicción a {minutes_ahead} mins: {predicted_ram:.2f}%")
    
    if predicted_ram > 90.0:
        print("🚨 ¡ALERTA CRÍTICA! 🚨 POSIBLE DESBORDAMIENTO DE MEMORIA INMINENTE")
    elif predicted_ram > 75.0:
        print("⚠️ ADVERTENCIA: Tendencia al alza, vigilar memoria.")
    else:
        print("✅ SISTEMA ESTABLE: No se prevén anomalías.")
    print("="*50 + "\n")

def run_predictor():
    while True:
        try:
            response = requests.get(API_URL)
            if response.status_code == 200:
                data = response.json()
                if len(data) < 2:
                    print("⏳ [CENTINELA AI] - Recopilando datos insuficientes. Esperando...")
                else:
                    # Extraer timestamps (en segundos) y RAM
                    timestamps = []
                    rams = []
                    for row in data:
                        # Convertir ISO a timestamp numérico
                        # Nota: Si termina en Z o trae offset, fromisoformat en Python 3.11 lo soporta
                        dt_str = row['timestamp']
                        # Reemplazar Z por +00:00 para compatibilidad en caso de ser necesario
                        dt_str = dt_str.replace("Z", "+00:00")
                        dt = datetime.fromisoformat(dt_str)
                        timestamps.append(dt.timestamp())
                        rams.append(row['ram'])
                    
                    df = pd.DataFrame({'time': timestamps, 'ram': rams})
                    
                    # Preparar datos para sklearn
                    X = df[['time']].values
                    y = df['ram'].values
                    
                    model = LinearRegression()
                    model.fit(X, y)
                    
                    # Predecir a futuro (5 minutos = 300 segundos)
                    last_time = df['time'].iloc[-1]
                    future_time = last_time + 300
                    
                    # predict devuelve un array, tomamos el primer elemento
                    predicted_ram = model.predict([[future_time]])[0]
                    
                    # Clampear el valor entre 0 y 100 por seguridad
                    predicted_ram = max(0.0, min(100.0, predicted_ram))
                    current_ram = y[-1]
                    
                    print_cyber_report(current_ram, predicted_ram, 5)
            else:
                print(f"❌ [CENTINELA AI] - Error de conexión API: {response.status_code}")
        except Exception as e:
            print(f"❌ [CENTINELA AI] - Falla en el sistema predictivo: {e}")
        
        # Esperar 15 segundos antes de la siguiente iteración
        time.sleep(15)

if __name__ == "__main__":
    print("🚀 [CENTINELA AI] INICIALIZANDO NÚCLEO PREDICTIVO...")
    run_predictor()
