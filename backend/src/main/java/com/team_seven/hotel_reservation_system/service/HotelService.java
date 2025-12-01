package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.HotelDto;
import com.team_seven.hotel_reservation_system.models.Hotel;
import com.team_seven.hotel_reservation_system.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class HotelService {

    private final HotelRepository hotelRepository;

    @Autowired
    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<HotelDto> getAll() {
        List<Hotel> hotels = hotelRepository.findAll();
        
        if (hotels.isEmpty()) {
            System.out.println("!!! WARNING: HotelRepository found 0 hotels in the database !!!");
            return Collections.emptyList();
        }

        return hotels.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<HotelDto> getTopRated() {
        return hotelRepository.findTop3ByRatingIsNotNullOrderByRatingDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private HotelDto toDto(Hotel h) {
        if (h == null) return null;
        
        try {
            return HotelDto.builder()
                    .id(h.getId())
                    .name(h.getName())
                    .address(h.getAddress())
                    .city(h.getCity())
                    .phoneNumber(h.getPhoneNumber())
                    .description(h.getDescription())
                    .rating(h.getRating())
                    .build();
        } catch (Exception e) {
            System.out.println("!!! Error mapping Hotel ID " + h.getId() + ": " + e.getMessage());
            return null;
        }
    }
}