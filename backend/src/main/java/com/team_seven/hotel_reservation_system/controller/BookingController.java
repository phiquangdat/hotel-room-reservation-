package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.service.BookingService;
import com.team_seven.hotel_reservation_system.dto.GuestBookingRequestDto;
import com.team_seven.hotel_reservation_system.models.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;

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
}
