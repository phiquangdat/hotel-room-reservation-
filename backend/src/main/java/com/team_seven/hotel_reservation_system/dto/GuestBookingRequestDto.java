package com.team_seven.hotel_reservation_system.dto;

import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data 
@NoArgsConstructor
@AllArgsConstructor
public class GuestBookingRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;

    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numberOfGuests;
}
