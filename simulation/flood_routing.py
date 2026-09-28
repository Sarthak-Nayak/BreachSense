import math
import numpy as np

def generate_downstream_path(dam_info):
    """
    Returns coordinate path representing downstream river channel.
    Uses hardcoded realistic river reaches for pilot dams, or interpolated downstream vectors for others.
    """
    dam_id = dam_info.get("id", "")
    lat, lng = dam_info["lat"], dam_info["lng"]
    
    if dam_id == "dam-tehri":
        # Bhagirathi / Ganga River reach down to Haridwar & Roorkee
        return [
            (30.3778, 78.4803), # Dam
            (30.3120, 78.5210),
            (30.2450, 78.5600),
            (30.1458, 78.5986), # Devprayag (35km)
            (30.0980, 78.4890),
            (30.0650, 78.4320), # Vyasi (54km)
            (30.1360, 78.3890), # Shivpuri (72km)
            (30.0869, 78.2676), # Rishikesh (88km)
            (29.9890, 78.2100),
            (29.9457, 78.1642)  # Haridwar (112km)
        ]
    elif dam_id == "dam-sardar-sarovar":
        # Narmada River reach down to Bharuch
        return [
            (21.8319, 73.7486), # Dam
            (21.8210, 73.7120), # Kevadia (4.5km)
            (21.8480, 73.6150), # Garudeshwar (14.8km)
            (21.8680, 73.5020), # Rajpipla (28km)
            (21.9050, 73.3320), # Sinor (52km)
            (21.7051, 72.9959)  # Bharuch (95km)
        ]
    elif dam_id == "dam-bhakra":
        # Sutlej River reach down to Nangal & Anandpur Sahib
        return [
            (31.4147, 76.4356), # Dam
            (31.3650, 76.3820), # Nangal
            (31.2350, 76.5020), # Anandpur Sahib
            (31.1000, 76.4000)
        ]
    elif dam_id == "dam-hirakud":
        # Mahanadi River reach down to Sambalpur & Cuttack
        return [
            (21.5700, 83.8700), # Dam
            (21.4669, 83.9812), # Sambalpur
            (21.2000, 84.5000),
            (20.4625, 85.8828)  # Cuttack reach
        ]
    elif dam_id == "dam-mullaperiyar":
        # Periyar River reach down to Vandiperiyar & Idukki
        return [
            (9.5312, 77.1444), # Dam
            (9.5780, 77.0850), # Vandiperiyar
            (9.8417, 76.9733)  # Idukki reservoir reach
        ]
    else:
        # Generic downstream river vector generator for non-pilot dams
        path = [(lat, lng)]
        angle = math.radians(225)
        step_km = 8.0
        for i in range(1, 10):
            meander = math.sin(i * 0.8) * 0.05
            d_lat = (step_km * math.cos(angle + meander)) / 111.0
            d_lng = (step_km * math.sin(angle + meander)) / (111.0 * math.cos(math.radians(lat)))
            path.append((lat + d_lat * i, lng + d_lng * i))
        return path

def calculate_flood_extent_polygon(center_path, current_reach_dist_km, max_width_km, depth_m):
    """
    Generates GeoJSON Polygon coordinates around river path segment up to current reach distance.
    """
    if len(center_path) < 2:
        return []
    
    total_dist = 0.0
    active_points = [center_path[0]]
    
    for i in range(1, len(center_path)):
        p1, p2 = center_path[i-1], center_path[i]
        d_lat = (p2[0] - p1[0]) * 111.0
        d_lng = (p2[1] - p1[1]) * 111.0 * math.cos(math.radians(p1[0]))
        seg_dist = math.sqrt(d_lat**2 + d_lng**2)
        
        if total_dist + seg_dist <= current_reach_dist_km:
            active_points.append(p2)
            total_dist += seg_dist
        else:
            frac = max(0.01, min(0.99, (current_reach_dist_km - total_dist) / seg_dist))
            interp_lat = p1[0] + (p2[0] - p1[0]) * frac
            interp_lng = p1[1] + (p2[1] - p1[1]) * frac
            active_points.append((interp_lat, interp_lng))
            break

    if len(active_points) < 2:
        return []

    left_bank = []
    right_bank = []
    
    num_pts = len(active_points)
    for idx, (lat, lng) in enumerate(active_points):
        progress = idx / float(num_pts - 1) if num_pts > 1 else 1.0
        width_factor = max_width_km * math.sin(progress * math.pi) * 0.8 + (max_width_km * 0.4)
        
        if idx < num_pts - 1:
            next_pt = active_points[idx + 1]
            dy = (next_pt[0] - lat)
            dx = (next_pt[1] - lng) * math.cos(math.radians(lat))
        else:
            prev_pt = active_points[idx - 1]
            dy = (lat - prev_pt[0])
            dx = (lng - prev_pt[1]) * math.cos(math.radians(lat))
            
        mag = math.sqrt(dx*dx + dy*dy)
        if mag == 0:
            nx, ny = 0.0, 1.0
        else:
            nx = -dy / mag
            ny = dx / mag
            
        offset_lat = (ny * width_factor) / 111.0
        offset_lng = (nx * width_factor) / (111.0 * math.cos(math.radians(lat)))
        
        left_bank.append([lng + offset_lng, lat + offset_lat])
        right_bank.append([lng - offset_lng, lat - offset_lat])
        
    polygon_ring = left_bank + right_bank[::-1] + [left_bank[0]]
    return polygon_ring

def calculate_loss_and_damage(risk_zones, max_flooded_sqkm, peak_discharge):
    """
    Computes Loss & Damage estimate (Deliverable i / B3).
    Cross-references inundated settlements, population, and critical infrastructure points.
    Returns structured economic & population impact summary.
    """
    total_pop_affected = sum(z["population"] for z in risk_zones)
    
    # Collect all critical infrastructure across affected settlements
    all_infra = []
    for z in risk_zones:
        infra_list = z.get("critical_infrastructure", [])
        for inf in infra_list:
            all_infra.append({
                "name": inf,
                "settlement": z["name"],
                "est_depth_m": z["est_depth_m"]
            })

    # Infrastructure category breakdown
    hospitals_count = sum(1 for i in all_infra if "Hospital" in i["name"] or "Clinic" in i["name"] or "Medical" in i["name"] or "Trauma" in i["name"])
    schools_count = sum(1 for i in all_infra if "School" in i["name"] or "College" in i["name"] or "Degree" in i["name"])
    bridges_count = sum(1 for i in all_infra if "Bridge" in i["name"] or "Jhula" in i["name"] or "Weir" in i["name"])
    power_count = sum(1 for i in all_infra if "Substation" in i["name"] or "Power" in i["name"] or "Plant" in i["name"] or "Chemical" in i["name"] or "Grid" in i["name"])
    
    # Economic exposure estimate in ₹ Crores (approx ₹ 12.5 Cr per sqkm of inundated built-up & agricultural terrain)
    base_economic_exposure_cr = round(max_flooded_sqkm * 14.8 + (total_pop_affected * 0.015), 1)

    return {
        "total_population_affected": total_pop_affected,
        "critical_infra_total": len(all_infra),
        "hospitals_at_risk": hospitals_count,
        "schools_at_risk": schools_count,
        "bridges_roads_at_risk": bridges_count,
        "power_industrial_at_risk": power_count,
        "economic_exposure_crores_inr": base_economic_exposure_cr,
        "infrastructure_list": all_infra
    }

def route_flood_wave(dam_info, breach_params, villages_seed):
    """
    Computes time-series GeoJSON flood polygons, downstream arrival times, and Loss & Damage.
    """
    q_peak = breach_params["q_peak_cumec"]
    h_w = breach_params["effective_head_m"]
    
    wave_speed_kmh = max(12.0, min(35.0, 12.0 + 8.0 * math.log10(max(1.0, q_peak / 2000.0))))
    center_path = generate_downstream_path(dam_info)
    timesteps_min = [0, 15, 30, 45, 60, 90, 120, 150, 180, 240, 300, 360]
    
    geojson_timesteps = []
    max_flooded_sqkm = 0.0
    
    for t_min in timesteps_min:
        t_hr = t_min / 60.0
        reach_dist_km = wave_speed_kmh * t_hr
        
        if reach_dist_km <= 0.2:
            features = []
            max_depth = 0.0
            flooded_area_sqkm = 0.0
        else:
            max_width_km = min(4.5, 0.4 + (reach_dist_km * 0.025))
            depth_m = max(0.5, h_w * math.exp(-0.015 * reach_dist_km))
            ring = calculate_flood_extent_polygon(center_path, reach_dist_km, max_width_km, depth_m)
            
            flooded_area_sqkm = round(reach_dist_km * max_width_km * 1.3, 2)
            max_depth = round(depth_m, 2)
            max_flooded_sqkm = max(max_flooded_sqkm, flooded_area_sqkm)
            
            features = []
            if ring:
                depth_category = "Extreme (> 10m)" if depth_m > 10 else "High (5-10m)" if depth_m > 5 else "Moderate (2-5m)" if depth_m > 2 else "Shallow (< 2m)"
                fill_color = "#DC2626" if depth_m > 10 else "#F59E0B" if depth_m > 5 else "#1D6FD9" if depth_m > 2 else "#60A5FA"
                
                features.append({
                    "type": "Feature",
                    "properties": {
                        "timestep_min": t_min,
                        "reach_distance_km": round(reach_dist_km, 1),
                        "max_depth_m": max_depth,
                        "flooded_area_sqkm": flooded_area_sqkm,
                        "depth_category": depth_category,
                        "fill_color": fill_color,
                        "stroke_color": "#1E40AF"
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ring]
                    }
                })
                
        geojson_timesteps.append({
            "timestep_min": t_min,
            "timestep_hr": round(t_hr, 2),
            "reach_dist_km": round(reach_dist_km, 1),
            "max_depth_m": max_depth,
            "flooded_area_sqkm": flooded_area_sqkm,
            "geojson": {
                "type": "FeatureCollection",
                "features": features
            }
        })
        
    # Calculate Downstream Village Impact & Arrival Times
    dam_villages = [v for v in villages_seed if v.get("dam_id") == dam_info.get("id")]
    if not dam_villages:
        dam_villages = []
        path_pts = center_path[1:]
        for idx, pt in enumerate(path_pts[:4]):
            dist = round((idx + 1) * 18.5, 1)
            dam_villages.append({
                "dam_id": dam_info["id"],
                "id": f"v-syn-{idx+1}",
                "name": f"Reach Station {idx+1} ({dam_info['nearest_city']})",
                "region": f"{dam_info['district']}, {dam_info['state'][:2].upper()}",
                "district": dam_info["district"],
                "distance_km": dist,
                "elevation_m": max(10, int(dam_info["height_m"] * 0.8 - dist * 2)),
                "population": (idx + 1) * 9200,
                "lat": pt[0],
                "lng": pt[1],
                "critical_infrastructure": [f"Station {idx+1} Hospital", f"Highway Bridge {idx+1}", f"Substation {idx+1}"]
            })

    risk_zones = []
    for v in dam_villages:
        dist_km = v["distance_km"]
        arrival_time_min = round((dist_km / wave_speed_kmh) * 60.0, 1)
        arrival_time_hr = round(arrival_time_min / 60.0, 2)
        est_depth_m = max(0.4, round(h_w * math.exp(-0.018 * dist_km), 2))
        
        urgency = "CRITICAL" if arrival_time_min <= 60 else "HIGH" if arrival_time_min <= 180 else "MODERATE"
        badge_color = "#DC2626" if urgency == "CRITICAL" else "#F59E0B" if urgency == "HIGH" else "#1D6FD9"
            
        risk_zones.append({
            "village_id": v["id"],
            "name": v["name"],
            "region": v.get("region", f"{v['district']}, India"),
            "district": v["district"],
            "distance_km": dist_km,
            "lat": v["lat"],
            "lng": v["lng"],
            "population": v["population"],
            "elevation_m": v["elevation_m"],
            "arrival_time_min": arrival_time_min,
            "arrival_time_hr": arrival_time_hr,
            "est_depth_m": est_depth_m,
            "urgency": urgency,
            "alert_level": "RED ALERT" if urgency == "CRITICAL" else "ORANGE WARNING" if urgency == "HIGH" else "YELLOW ADVISORY",
            "badge_color": badge_color,
            "critical_infrastructure": v.get("critical_infrastructure", []),
            "sms_alert": f"CRITICAL FLOOD WARNING: Breach at {dam_info['name']}. Flood waters reach {v['name']} in approx {arrival_time_min} mins with depth ~{est_depth_m}m."
        })

    # Sort risk zones by arrival time ascending (soonest first)
    risk_zones.sort(key=lambda x: x["arrival_time_min"])
    
    # Calculate Loss and Damage
    loss_damage = calculate_loss_and_damage(risk_zones, max_flooded_sqkm, q_peak)
    
    return {
        "wave_speed_kmh": round(wave_speed_kmh, 1),
        "total_timesteps": len(timesteps_min),
        "geojson_timesteps": geojson_timesteps,
        "risk_zones": risk_zones,
        "loss_damage": loss_damage
    }
