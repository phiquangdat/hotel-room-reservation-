package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.RegisterDto;
import org.springframework.stereotype.Service;

@Service
public class AuthService {


    public String registerUser(RegisterDto dto) {

        return "User " + dto.getUsername() + " registered successfully!";
    }
}