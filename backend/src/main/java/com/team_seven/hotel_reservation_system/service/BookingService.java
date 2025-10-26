package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.CreateBookingDto;

public interface BookingService {
    String createBooking(CreateBookingDto dto);
}
