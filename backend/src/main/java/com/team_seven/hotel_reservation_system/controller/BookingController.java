package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.service.BookingService;
import com.team_seven.hotel_reservation_system.dto.CreateBookingDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<String> create(@RequestBody CreateBookingDto dto) {
        String res = bookingService.createBooking(dto);
        return ResponseEntity.ok(res);
    }
}
