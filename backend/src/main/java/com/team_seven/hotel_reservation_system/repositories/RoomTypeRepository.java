package com.team_seven.hotel_reservation_system.repositories;

import com.team_seven.hotel_reservation_system.models.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    
}
