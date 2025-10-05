package com.payment.user_service.service;

import com.payment.user_service.model.DTO.PaymentDTO;
import com.payment.user_service.model.DTO.PaymentNpci;
import com.payment.user_service.model.Payment;
import com.payment.user_service.model.User;
import com.payment.user_service.repo.PaymentRepo;
import com.payment.user_service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private KafkaTemplate<String,Object> kafkaTemplate;


    public ResponseEntity<Payment> createPayment(PaymentDTO paydto) {
        try {
            User payer = userRepo.findByUpiId(paydto.getFromVpa());
            Payment payment = new Payment();
            payment.setUser(payer);
            payment.setToVpa(paydto.getToVpa());
            payment.setFromVpa(paydto.getFromVpa());
            payment.setRequestId(UUID.randomUUID().toString());
            payment.setAmount(paydto.getAmount());
            payment.setCreatedAt(LocalDateTime.now());
            payment.setStatus("PENDING");
            paymentRepo.save(payment);

            PaymentNpci paymentNpci = new PaymentNpci();
            paymentNpci.setToVpa(paydto.getToVpa());
            paymentNpci.setFromVpa(paydto.getFromVpa());
            paymentNpci.setRequestId(payment.getRequestId());
            paymentNpci.setAmount(paydto.getAmount());
            paymentNpci.setStatus("PENDING");

            kafkaTemplate.send("payment-requests",paymentNpci);

            return new ResponseEntity<>(payment, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(new Payment(),HttpStatus.BAD_REQUEST);
    }

    @KafkaListener(topics = "psp-response",groupId = "psp-group")
    public void updatePaymentStatus(PaymentNpci response) {
        Payment payment = paymentRepo.findByRequestId(response.getRequestId());

        if(payment != null) {
            payment.setStatus(response.getStatus());
            payment.setCreatedAt(LocalDateTime.now());
        }

        if(response.getStatus().equals("SUCCESS")) {
            User payer = userRepo.findByUpiId(response.getFromVpa());
            User payee = userRepo.findByUpiId(response.getToVpa());

            payer.setBalance(payer.getBalance() - response.getAmount());
            payee.setBalance(payee.getBalance() + response.getAmount());

            userRepo.save(payer);
            userRepo.save(payee);
        }
        paymentRepo.save(payment);
    }

    public ResponseEntity<String> fetchStatus(String requestId) {
        try {
            Payment payment = paymentRepo.findByRequestId(requestId);
            if(payment == null)
                throw new RuntimeException("not found");

            return new ResponseEntity<>(payment.getStatus(),HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>("Not found",HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<List<Payment>> fetchHistory(String email) {
        try {
            User payer = userRepo.findByEmail(email);
            if(payer.getPayments().isEmpty())
                throw new RuntimeException("empty payments");

            List<Payment> payments = payer.getPayments()
                    .stream()
                    .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt())) // latest first
                    .toList();

            return new ResponseEntity<>(payments,HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.BAD_REQUEST);
    }
}
