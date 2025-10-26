package com.team_seven.hotel_reservation_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomSearchResultDto {
    private Long roomId;
    private String hotelName;
    private String city;
    private String roomType;
    private String imageUrl;
    private BigDecimal pricePerNight;
    private Integer capacity;
}
