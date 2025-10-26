package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.UserRegisterRequest; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// @Service
public class AuthService {
    
    @Autowired
    private CustomerService customerService;

    public String registerUser(UserRegisterRequest request) { 
        return customerService.registerUser(request);
    }
}
