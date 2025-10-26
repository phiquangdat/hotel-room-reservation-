package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.RegisterDto;
import com.team_seven.hotel_reservation_system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

// @RestController
// @RequestMapping("/api/auth")
// @CrossOrigin(origins = "*")
public class AuthController {

    // @Autowired
    // private AuthService authService;

    // @PostMapping("/register") 
    // public ResponseEntity<String> register(@RequestBody RegisterDto request) {
    //     String result = authService.registerUser(request);
    //     return ResponseEntity.created(URI.create("/api/auth/register")).body(result);
    // }
}
