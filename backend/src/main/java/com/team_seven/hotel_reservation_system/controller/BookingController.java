package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.service.BookingService;
import com.team_seven.hotel_reservation_system.dto.GuestBookingRequestDto;
import com.team_seven.hotel_reservation_system.models.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import java.net.URI;
import java.util.List;
// 7.11
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody GuestBookingRequestDto bookingDto) {
        Booking newBooking = bookingService.createBooking(bookingDto);
        URI location = URI.create("/api/bookings/" + newBooking.getId());
        return ResponseEntity.created(location).body(newBooking);
    }

    @GetMapping
    public Page<Booking> getBookings(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingService.getBookings(status, pageable);
    }

    @GetMapping("/my-bookings")
    public List<Booking> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername(); 
        return bookingService.getBookingsByCurrentUser(userEmail);
    }

    @PatchMapping("/{id}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestParam String status) {
        return bookingService.updateStatus(id, status);
    }
}
