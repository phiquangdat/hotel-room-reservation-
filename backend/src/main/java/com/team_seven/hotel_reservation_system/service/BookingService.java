package com.team_seven.hotel_reservation_system.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.team_seven.hotel_reservation_system.dto.GuestBookingRequestDto;
import com.team_seven.hotel_reservation_system.models.Booking;

public interface BookingService {
    Booking createBooking(GuestBookingRequestDto dto);
    Page<Booking> getBookings(String statusFilter, Pageable pageable);
    Booking updateStatus(Long id, String status);
}
