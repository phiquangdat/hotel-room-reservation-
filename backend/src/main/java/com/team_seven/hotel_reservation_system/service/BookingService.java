package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.GuestBookingRequestDto;
import com.team_seven.hotel_reservation_system.models.Booking;

public interface BookingService {
    Booking createBooking(GuestBookingRequestDto dto);
}
