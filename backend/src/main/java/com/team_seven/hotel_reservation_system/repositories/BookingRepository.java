package com.team_seven.hotel_reservation_system.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.team_seven.hotel_reservation_system.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findAllByStatusContainingIgnoreCase(String status, Pageable pageable);
}
