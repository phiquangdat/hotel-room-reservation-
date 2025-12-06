package com.team_seven.hotel_reservation_system.service.impl;

import com.team_seven.hotel_reservation_system.dto.GuestBookingRequestDto; 
import com.team_seven.hotel_reservation_system.models.Booking;
import com.team_seven.hotel_reservation_system.models.Customer;
import com.team_seven.hotel_reservation_system.models.Room;
import com.team_seven.hotel_reservation_system.repositories.BookingRepository;
import com.team_seven.hotel_reservation_system.repositories.CustomerRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomRepository;
import com.team_seven.hotel_reservation_system.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;
import java.util.Optional; 

@Service
public class BookingServiceImpl implements BookingService {
    
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;
    
    @Override
    @Transactional 
    public Booking createBooking(GuestBookingRequestDto dto) { 
        Optional<Customer> existingCustomer = customerRepository.findByEmail(dto.getEmail());
        
        Customer customerToUse;
        if (existingCustomer.isPresent()) {
            customerToUse = existingCustomer.get();
        } else {
            Customer newCustomer = new Customer();
            newCustomer.setEmail(dto.getEmail());
            newCustomer.setFirstName(dto.getFirstName());
            newCustomer.setLastName(dto.getLastName());
            newCustomer.setPhoneNumber(dto.getPhoneNumber());
            customerToUse = customerRepository.save(newCustomer);
        }

        Room room = roomRepository.findById(dto.getRoomId()) 
            .orElseThrow(() -> new RuntimeException("Room not found with id: " + dto.getRoomId()));

        Booking newBooking = new Booking();
        newBooking.setCustomer(customerToUse); 
        newBooking.setRoom(room);
        newBooking.setCheckInDate(dto.getCheckInDate());
        newBooking.setCheckOutDate(dto.getCheckOutDate());
        newBooking.setNumberOfGuests(dto.getNumberOfGuests());
        newBooking.setStatus("CONFIRMED");

        long numberOfNights = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
        if (numberOfNights <= 0) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }
        
        BigDecimal pricePerNight = room.getRoomType().getPricePerNight(); 
        BigDecimal totalPrice = pricePerNight.multiply(BigDecimal.valueOf(numberOfNights));
        newBooking.setTotalPrice(totalPrice);

        return bookingRepository.save(newBooking);
    }

    @Override
    public Page<Booking> getBookings(String statusFilter, Pageable pageable) {
        if (statusFilter == null || statusFilter.isEmpty()) {
            return bookingRepository.findAll(pageable);
        }
        return bookingRepository.findAllByStatusContainingIgnoreCase(statusFilter, pageable);
    }

    @Override
    @Transactional
    public Booking updateStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
