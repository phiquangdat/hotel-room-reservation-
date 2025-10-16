package com.team_seven.hotel_reservation_system.repository;

import com.team_seven.hotel_reservation_system.models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
}
