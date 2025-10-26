package com.team_seven.hotel_reservation_system.repositories;



import com.team_seven.hotel_reservation_system.dto.RoomSearchResultDto;

import com.team_seven.hotel_reservation_system.models.RoomType;

import com.team_seven.hotel_reservation_system.models.Room;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;



import java.time.LocalDate;

import java.util.List;



@Repository

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

@Query("SELECT new com.team_seven.hotel_reservation_system.dto.RoomSearchResultDto(" +

" rt.id, " +

" h.name, " +

" h.city, " +

" rt.name, " +

" rt.imageUrl, " +

" rt.pricePerNight, " +

" rt.capacity) " +

"FROM RoomType rt JOIN rt.hotel h " +

"WHERE h.city = :city " +

"AND rt.capacity >= :guestCapacity " +

"AND EXISTS (" +

" SELECT r FROM Room r WHERE r.roomType = rt " +

" AND r.id NOT IN (" +

" SELECT b.room.id FROM Booking b " +

" WHERE (b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate)" +

" )" +

")")

List<RoomSearchResultDto> findAvailableRoomTypes(

@Param("city") String city,

@Param("checkInDate") LocalDate checkInDate,

@Param("checkOutDate") LocalDate checkOutDate,

@Param("guestCapacity") int guestCapacity

);

}
