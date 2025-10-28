package com.team_seven.hotel_reservation_system.repositories;

import com.team_seven.hotel_reservation_system.models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findTop3ByRatingIsNotNullOrderByRatingDesc();
}
