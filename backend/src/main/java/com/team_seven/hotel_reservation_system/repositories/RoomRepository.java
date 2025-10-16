package com.team_seven.hotel_reservation_system.repositories;

import com.team_seven.hotel_reservation_system.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
}
