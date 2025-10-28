package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.models.Hotel;
import com.team_seven.hotel_reservation_system.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {
    @Autowired
    private HotelRepository hotelRepository;

    @GetMapping("/top-rated")
    public List<Hotel> getTopRatedHotel() {
        return hotelRepository.findTop3ByRatingIsNotNullOrderByRatingDesc();
    }
}
