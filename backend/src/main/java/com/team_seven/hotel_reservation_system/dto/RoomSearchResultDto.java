package com.team_seven.hotel_reservation_system.repositories;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.Decimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomSearchResultDto {
    private Long roomId;
    private String imageUrl;
    private String hotelName;
    private String roomType;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private String roomNumber;
    private String roomStatus;
}
