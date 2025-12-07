package com.team_seven.hotel_reservation_system.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.team_seven.hotel_reservation_system.models.Booking;
import com.team_seven.hotel_reservation_system.models.Customer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findAllByStatusContainingIgnoreCase(String status, Pageable pageable);
    Optional<List<Booking>> findByCustomer(Customer customer);
    
    @Query("SELECT b FROM Booking b " +
            "JOIN FETCH b.customer c " +
            "JOIN FETCH b.room r " +
            "JOIN FETCH r.roomType rt " +
            "WHERE c.email = :email")
    List<Booking> findDetailedBookingsByCustomerEmail(@Param("email") String email);

    @Query(value = """
        SELECT b FROM Booking b 
        JOIN FETCH b.customer c 
        JOIN FETCH b.room r 
        JOIN FETCH r.roomType rt
    """,
    countQuery = "SELECT COUNT(b) FROM Booking b",
    nativeQuery = false)
    Page<Booking> findAllWithDetails(Pageable pageable);

    @Query(value = """
        SELECT b FROM Booking b 
        JOIN FETCH b.customer c 
        JOIN FETCH b.room r 
        JOIN FETCH r.roomType rt
        WHERE LOWER(b.status) LIKE LOWER(CONCAT('%', :status, '%'))
    """,
    countQuery = "SELECT COUNT(b) FROM Booking b WHERE LOWER(b.status) LIKE LOWER(CONCAT('%', :status, '%'))",
    nativeQuery = false)
    Page<Booking> findAllByStatusContainingIgnoreCaseWithDetails(@Param("status") String status, Pageable pageable);
}
