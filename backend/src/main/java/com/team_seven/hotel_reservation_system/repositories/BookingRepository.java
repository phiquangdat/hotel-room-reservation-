package com.team_seven.hotel_reservation_system.repositories;

import com.team_seven.hotel_reservation_system.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
}
