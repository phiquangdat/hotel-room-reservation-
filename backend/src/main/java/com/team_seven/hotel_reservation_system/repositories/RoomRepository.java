package com.team_seven.hotel_reservation_system.repositories;

import com.team_seven.hotel_reservation_system.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("SELECT r FROM Room r JOIN r.roomType rt JOIN rt.hotel h " + 
    "WHERE LOWER(h.city) = LOWER(:city) " +
    "AND rt.capacity >= :guestCapacity " + 
    "AND r.status = 'Available'")
    List<Room> findAvailableRoomsByCityAndCapacity(
        @Param("city") String city,
        @Param("guestCapacity") Integer guestCapacity
    );
}
