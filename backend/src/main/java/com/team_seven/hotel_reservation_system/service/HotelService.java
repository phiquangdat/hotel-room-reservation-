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

    @Transactional(readOnly = true)
    public HotelDto getById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
        return toDto(hotel);
    }

    @Transactional
    public HotelDto create(HotelDto dto) {
        Hotel hotel = new Hotel();
        hotel.setName(dto.getName());
        hotel.setAddress(dto.getAddress());
        hotel.setCity(dto.getCity());
        hotel.setPhoneNumber(dto.getPhoneNumber());
        hotel.setDescription(dto.getDescription());
        hotel.setImageUrl(dto.getImageUrl());
        hotel.setRating(dto.getRating());

        Hotel saved = hotelRepository.save(hotel);
        return toDto(saved);
    }

    @Transactional
    public HotelDto update(Long id, HotelDto dto) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));

        hotel.setName(dto.getName());
        hotel.setAddress(dto.getAddress());
        hotel.setCity(dto.getCity());
        hotel.setPhoneNumber(dto.getPhoneNumber());
        hotel.setDescription(dto.getDescription());
        hotel.setImageUrl(dto.getImageUrl());
        hotel.setRating(dto.getRating());

        Hotel updated = hotelRepository.save(hotel);
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new RuntimeException("Hotel not found with id: " + id);
        }
        hotelRepository.deleteById(id);
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
                    .imageUrl(h.getImageUrl())
                    .rating(h.getRating())
                    .build();
        } catch (Exception e) {
            System.out.println("!!! Error mapping Hotel ID " + h.getId() + ": " + e.getMessage());
            return null;
        }
    }
}