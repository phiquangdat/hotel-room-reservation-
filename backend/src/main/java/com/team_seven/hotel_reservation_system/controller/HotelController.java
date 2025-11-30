package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.HotelDto;
import com.team_seven.hotel_reservation_system.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping
    public List<HotelDto> getAllHotels() {
        return hotelService.getAll();
    }

    @GetMapping("/top-rated")
    public List<HotelDto> getTopRatedHotel() {
        return hotelService.getTopRated();
    }
}
