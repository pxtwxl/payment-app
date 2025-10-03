package com.payment.npci_switch.Service;

import com.payment.npci_switch.Model.DTO.PaymentNpci;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class NpciConsumerService {

    @Autowired
    private KafkaTemplate<String,Object> kafkaTemplate;

    @KafkaListener(topics = "payment-requests",groupId = "npci-switch")
    public void handlePaymentRequests(PaymentNpci payment) {

        PaymentNpci paymentDto = new PaymentNpci();
        paymentDto.setRequestId(payment.getRequestId());
        paymentDto.setAmount(payment.getAmount());
        paymentDto.setFromVpa(payment.getFromVpa());
        paymentDto.setToVpa(payment.getToVpa());
        paymentDto.setStatus(payment.getStatus());

        String bankTopic = "bank-transaction";

        kafkaTemplate.send(bankTopic,paymentDto);
    }

    @KafkaListener(topics = "payment-responses",groupId = "npci-switch")
    public void handleBankResponse(PaymentNpci response) {
        String pspTopic = "psp-response";
        kafkaTemplate.send(pspTopic,response);
    }

}
