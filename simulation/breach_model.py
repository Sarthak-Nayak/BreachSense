import math

def calculate_froehlich_breach(height_m, storage_capacity_mcm, breach_type="overtopping", breach_size="catastrophic", water_level_pct=100):
    """
    Calculates dam breach parameters using Froehlich (2008) empirical equations.
    
    Parameters:
    - height_m: Dam height in meters
    - storage_capacity_mcm: Storage volume in Million Cubic Meters (MCM)
    - breach_type: 'overtopping', 'piping', or 'structural'
    - breach_size: 'small', 'medium', or 'catastrophic'
    - water_level_pct: Percentage of full capacity reservoir height at breach (e.g. 100%, 120%)
    
    Returns:
    - Dictionary with breach peak outflow (cumec), formation time (hrs), average width (m), hydrograph
    """
    # Convert MCM to Cubic Meters (V_w)
    # Adjust V_w based on breach size factor
    size_factors = {"small": 0.35, "medium": 0.65, "catastrophic": 1.0}
    scale = size_factors.get(breach_size.lower(), 1.0)
    
    h_w = height_m * (water_level_pct / 100.0)  # Effective water head behind breach (m)
    v_w = (storage_capacity_mcm * 1e6) * scale   # Volume of water involved in breach (m3)
    
    # Overtopping factor K_o
    k_o_map = {
        "overtopping": 1.3,
        "piping": 1.0,
        "structural": 1.15
    }
    k_o = k_o_map.get(breach_type.lower(), 1.3)
    
    # Froehlich (2008) Peak Discharge: Q_p = 0.69 * (V_w ** 0.428) * (h_w ** 0.653)
    q_peak = 0.69 * (math.pow(v_w, 0.428)) * (math.pow(h_w, 0.653))
    
    # Froehlich Average Breach Width: B_avg = 0.27 * K_o * (V_w ** 0.32) * (h_w ** 0.04)
    b_avg = 0.27 * k_o * (math.pow(v_w, 0.32)) * (math.pow(h_w, 0.04))
    
    # Froehlich Formation Time t_f (hours): t_f = 0.0178 * (V_w ** 0.47) * (h_w ** -0.90)
    t_f_hrs = 0.0178 * (math.pow(v_w, 0.47)) * (math.pow(h_w, -0.90))
    t_f_hrs = max(0.1, min(t_f_hrs, 6.0)) # Sensible bounds for breach duration
    
    t_f_mins = t_f_hrs * 60.0
    
    # Total draining duration (approx 3x to 5x of peak formation time)
    drain_time_hrs = t_f_hrs * 4.0
    
    # Hydrograph points calculation Q(t) in m3/s over time in minutes
    total_time_mins = max(360, int(drain_time_hrs * 60))
    time_step_mins = 15
    
    hydrograph = []
    for t_min in range(0, total_time_mins + time_step_mins, time_step_mins):
        t_hr = t_min / 60.0
        if t_hr <= t_f_hrs:
            # Hydrograph rising limb (quadratic curve to peak)
            q_t = q_peak * math.pow(t_hr / t_f_hrs, 1.8)
        else:
            # Hydrograph falling limb (exponential decay)
            decay_factor = math.exp(-1.5 * (t_hr - t_f_hrs) / (drain_time_hrs - t_f_hrs))
            q_t = q_peak * decay_factor
            
        hydrograph.append({
            "time_min": t_min,
            "time_hr": round(t_hr, 2),
            "discharge_cumec": round(q_t, 2)
        })
        
    return {
        "q_peak_cumec": round(q_peak, 2),
        "b_avg_m": round(b_avg, 2),
        "t_f_hrs": round(t_f_hrs, 2),
        "t_f_mins": round(t_f_mins, 1),
        "effective_head_m": round(h_w, 2),
        "breach_volume_mcm": round(v_w / 1e6, 2),
        "hydrograph": hydrograph
    }
