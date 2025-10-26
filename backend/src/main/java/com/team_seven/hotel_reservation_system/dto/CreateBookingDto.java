package com.team_seven.hotel_reservation_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingDto {
    private Long roomId;
    private Long customerId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numberOfGuests;
}
