package com.team_seven.hotel_reservation_system.service.impl;

import com.team_seven.hotel_reservation_system.dto.CreateBookingDto;
import com.team_seven.hotel_reservation_system.models.Booking;
import com.team_seven.hotel_reservation_system.models.Customer;
import com.team_seven.hotel_reservation_system.models.Room;
import com.team_seven.hotel_reservation_system.repositories.BookingRepository;
import com.team_seven.hotel_reservation_system.repositories.CustomerRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomRepository;
import com.team_seven.hotel_reservation_system.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;

@Service
public class BookingServiceImpl implements BookingService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public String createBooking(CreateBookingDto dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        Room room = roomRepository.findById(dto.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found with id: " + dto.getRoomId()));

        Booking newBooking = new Booking();
        newBooking.setCustomer(customer);
        newBooking.setRoom(room);
        newBooking.setCheckInDate(dto.getCheckInDate());
        newBooking.setCheckOutDate(dto.getCheckOutDate());
        newBooking.setNumberOfGuests(dto.getNumberOfGuests());

        long numberOfNights = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
        BigDecimal pricePerNight = room.getRoomType().getPricePerNight();
        BigDecimal totalPrice = pricePerNight.multiply(BigDecimal.valueOf(numberOfNights));
        newBooking.setTotalPrice(totalPrice);

        newBooking.setStatus("CONFIRMED");

        bookingRepository.save(newBooking);

        return "Booking created successfully (ID: " + newBooking.getId() + ") for customer: " + customer.getFirstName();
    }
}
