package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.RoomTypeDto;
import com.team_seven.hotel_reservation_system.models.Hotel;
import com.team_seven.hotel_reservation_system.models.RoomType;
import com.team_seven.hotel_reservation_system.repositories.HotelRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final HotelRepository hotelRepository;

    @Autowired
    public RoomTypeService(RoomTypeRepository roomTypeRepository, HotelRepository hotelRepository){
        this.roomTypeRepository = roomTypeRepository;
        this.hotelRepository = hotelRepository;
    }

    @Transactional(readOnly = true)
    public List<RoomTypeDto> getAll() {
        return roomTypeRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomTypeDto getById(Long id) {
        RoomType rt = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room type not found"));
        return toDto(rt);
    }

    @Transactional
    public RoomTypeDto create(RoomTypeDto dto) {
        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        RoomType rt = RoomType.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .pricePerNight(dto.getPricePerNight())
                .capacity(dto.getCapacity())
                .hotel(hotel)
                .build();

        return toDto(roomTypeRepository.save(rt));
    }

    @Transactional
    public RoomTypeDto update(Long id, RoomTypeDto dto) {
        RoomType rt = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        rt.setName(dto.getName());
        rt.setDescription(dto.getDescription());
        rt.setImageUrl(dto.getImageUrl());
        rt.setPricePerNight(dto.getPricePerNight());
        rt.setCapacity(dto.getCapacity());

        return toDto(roomTypeRepository.save(rt));
    }

    @Transactional
    public void delete(Long id) {
        roomTypeRepository.deleteById(id);
    }

    private RoomTypeDto toDto(RoomType rt) {
        if (rt == null) return null;

        Hotel hotel = rt.getHotel();
        Long hotelId = (hotel != null) ? hotel.getId() : null;
        String hotelName = (hotel != null) ? hotel.getName() : null;

        return RoomTypeDto.builder()
                .id(rt.getId())
                .name(rt.getName())
                .imageUrl(rt.getImageUrl())
                .description(rt.getDescription())
                .pricePerNight(rt.getPricePerNight())
                .capacity(rt.getCapacity())
                .hotelId(hotelId)     
                .hotelName(hotelName)
                .build();
    }
}
