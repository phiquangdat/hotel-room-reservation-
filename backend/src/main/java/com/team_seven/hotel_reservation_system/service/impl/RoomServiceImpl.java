package com.team_seven.hotel_reservation_system.service.impl;

import com.team_seven.hotel_reservation_system.dto.RoomDto;
import com.team_seven.hotel_reservation_system.models.Hotel; 
import com.team_seven.hotel_reservation_system.models.Room;
import com.team_seven.hotel_reservation_system.models.RoomType;
import com.team_seven.hotel_reservation_system.repositories.RoomRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomTypeRepository;
import com.team_seven.hotel_reservation_system.service.RoomService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, RoomTypeRepository roomTypeRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    private RoomDto toDto(Room r) {
        if (r == null) return null;
        RoomType roomType = r.getRoomType(); 
        Hotel hotel = (roomType != null) ? roomType.getHotel() : null; 

        return RoomDto.builder()
                .id(r.getId())
                .roomNumber(r.getRoomNumber())
                .roomTypeId(roomType != null ? roomType.getId() : null)
                .roomTypeName(roomType != null ? roomType.getName() : "N/A") 
                .imageUrl(roomType != null ? roomType.getImageUrl() : null)
                .description(roomType != null ? roomType.getDescription() : null)
                .pricePerNight(roomType != null ? roomType.getPricePerNight() : null)
                .status(r.getStatus())
                .capacity(roomType != null ? roomType.getCapacity() : null)
                .hotelName(hotel != null ? hotel.getName() : "N/A") 
                .build();
    }

    private Room toEntity(RoomDto d) {
        if (d == null) return null;

        RoomType roomType = roomTypeRepository.findById(d.getRoomTypeId())
                .orElseThrow(() -> new EntityNotFoundException("RoomType not found with ID: " + d.getRoomTypeId()));

        Room room = new Room();
        room.setId(d.getId()); 
        room.setRoomNumber(d.getRoomNumber());
        room.setRoomType(roomType);
        room.setStatus(d.getStatus());
        return Room.builder()
                .id(d.getId()) 
                .roomNumber(d.getRoomNumber())
                .roomType(roomType)
                .status(d.getStatus())
                .build();
    }

    @Override
    @Transactional 
    public RoomDto create(RoomDto dto) {
        dto.setId(null); 
        Room roomToSave = toEntity(dto);
        Room saved = roomRepository.save(roomToSave);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomDto getById(Long id) {
        return roomRepository.findById(id)
                .map(this::toDto) 
                .orElseThrow(() -> new EntityNotFoundException("Room not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDto> getAll() {
        return roomRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RoomDto update(Long id, RoomDto dto) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with ID: " + id));

        RoomType newRoomType = roomTypeRepository.findById(dto.getRoomTypeId())
                .orElseThrow(() -> new EntityNotFoundException("RoomType not found with ID: " + dto.getRoomTypeId()));

        existingRoom.setRoomNumber(dto.getRoomNumber());
        existingRoom.setStatus(dto.getStatus());
        existingRoom.setRoomType(newRoomType);

        Room updatedRoom = roomRepository.save(existingRoom);
        return toDto(updatedRoom);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new EntityNotFoundException("Room not found with ID: " + id);
        }
        roomRepository.deleteById(id);
    }
}
