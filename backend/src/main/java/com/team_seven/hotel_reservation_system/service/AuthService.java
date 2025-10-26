package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.RegisterDto;
import com.team_seven.hotel_reservation_system.dto.UserRegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserService userService;

    public String registerUser(RegisterDto dto) {
        UserRegisterRequest request = new UserRegisterRequest();
        request.setUsername(dto.getUsername());
        request.setEmail(dto.getEmail());
        request.setPassword(dto.getPassword());
        return userService.registerUser(request);
    }
}