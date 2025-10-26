package com.team_seven.hotel_reservation_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterRequest {
    
    private String email;

    private String firstName;
    private String lastName;
    private String phoneNumber;
}
