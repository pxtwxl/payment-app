package com.payment.user_service.controller;

import com.payment.user_service.model.DTO.PaymentDTO;
import com.payment.user_service.model.Payment;
import com.payment.user_service.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<Payment> initiatePayment(@RequestBody PaymentDTO payment) {
        return paymentService.createPayment(payment);
    }

    @GetMapping("/status/{requestId}")
    public ResponseEntity<String> getStatus(@PathVariable("requestId") String requestId) {
        return paymentService.fetchStatus(requestId);
    }

    @GetMapping("history/{email}")
    public ResponseEntity<List<Payment>> fetchHistory(@PathVariable("email") String email) {
        return paymentService.fetchHistory(email);
    }
}
