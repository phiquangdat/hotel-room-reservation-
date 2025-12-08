package com.team_seven.hotel_reservation_system.repositories;

import com.team_seven.hotel_reservation_system.dto.RoomSearchResultDto;
import com.team_seven.hotel_reservation_system.models.RoomType;
import com.team_seven.hotel_reservation_system.models.Hotel;
import com.team_seven.hotel_reservation_system.models.Room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
@Query("""
    SELECT new com.team_seven.hotel_reservation_system.dto.RoomSearchResultDto(
        r.id,                   
        h.name,
        h.city,
        rt.name,
        rt.imageUrl,
        rt.pricePerNight,
        rt.capacity
    )
    FROM Room r
    JOIN r.roomType rt
    JOIN rt.hotel h
    WHERE h.city = :city
      AND rt.capacity >= :guestCapacity
      AND r.status NOT IN ('BOOKED', 'MAINTENANCE', 'OCCUPIED')
      AND NOT EXISTS (
        SELECT 1 FROM Booking b
        WHERE b.room = r
          AND b.checkInDate < :checkOutDate
          AND b.checkOutDate > :checkInDate
          AND b.status IN ('CONFIRMED', 'CHECKED_IN')
      )
    GROUP BY r.id, h.name, h.city, rt.name, rt.imageUrl, rt.pricePerNight, rt.capacity
    """)
    List<RoomSearchResultDto> findAvailableRoomTypes(
        @Param("city") String city,
        @Param("checkInDate") LocalDate checkInDate,
        @Param("checkOutDate") LocalDate checkOutDate,
        @Param("guestCapacity") int guestCapacity
    );
    Optional<RoomType> findByName(String name);
    Optional<RoomType> findByNameAndHotel(String name, Hotel hotel);
}
