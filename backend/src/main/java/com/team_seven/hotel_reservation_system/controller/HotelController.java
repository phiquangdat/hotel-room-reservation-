package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.HotelDto;
import com.team_seven.hotel_reservation_system.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {
    
    private final HotelService hotelService;

    public HotelController(HotelService hotelService){
        this.hotelService = hotelService;
    }

    @GetMapping
    public List<HotelDto> getAllHotels() {
        return hotelService.getAll();
    }

    @GetMapping("/hello")
    public String getHello() {
        return "Hello";
    }

    @GetMapping("/top-rated")
    public List<HotelDto> getTopRatedHotel() {
        return hotelService.getTopRated();
    }
}
