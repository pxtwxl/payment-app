package com.payment.bank_1_Server.Component;

import com.payment.bank_1_Server.model.Bank1;
import com.payment.bank_1_Server.model.Bank2;
import com.payment.bank_1_Server.model.DTO.PaymentDto;
import com.payment.bank_1_Server.repo.Bank1Repo;
import com.payment.bank_1_Server.repo.Bank2Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class BankConsumer {

    @Autowired
    private KafkaTemplate<String,Object> kafkaTemplate;

    @Autowired
    private Bank1Repo repoA;

    @Autowired
    private Bank2Repo repoB;

    private boolean isValidUser(String upi) {
        if(repoA.findByCustomerUpiId(upi) != null) {
            return true;
        }
        else if(repoB.findByCustomerUpiId(upi) != null) {
            return true;
        }

        return false;
    }

    private boolean sufficientBalance(String upi,double balance) {

        Bank1 bank1 = repoA.findByCustomerUpiId(upi);
        Bank2 bank2 = repoB.findByCustomerUpiId(upi);

        if(bank1 != null) {
            return bank1.getCustomerBalance() >= balance;
        } else if(bank2 != null) {
            return bank2.getCustomerBalance() >= balance;
        }

        return false;
    }

    private void deductAmount(String upi,double amount) {
        Bank1 bank1 = repoA.findByCustomerUpiId(upi);
        Bank2 bank2 = repoB.findByCustomerUpiId(upi);

        if(bank1 != null) {
            bank1.setCustomerBalance(bank1.getCustomerBalance() - amount);
            repoA.save(bank1);
        } else if(bank2 != null) {
            bank2.setCustomerBalance(bank2.getCustomerBalance() - amount);
            repoB.save(bank2);
        }
    }

    private void addAmount(String upi, double amount) {
        Bank1 bank1 = repoA.findByCustomerUpiId(upi);
        Bank2 bank2 = repoB.findByCustomerUpiId(upi);

        if(bank1 != null) {
            bank1.setCustomerBalance(bank1.getCustomerBalance() + amount);
            repoA.save(bank1);
        } else if(bank2 != null) {
            bank2.setCustomerBalance(bank2.getCustomerBalance() + amount);
            repoB.save(bank2);
        }
    }

    @KafkaListener(topics = "bank-transaction" , groupId = "bank-group")
    public void processPayments(PaymentDto payment) {
        String payerUPI = payment.getFromVpa();
        String payeeUPI = payment.getToVpa();
        String status;

        if(isValidUser(payerUPI) && isValidUser(payeeUPI)
        && sufficientBalance(payerUPI, payment.getAmount())) {
            deductAmount(payerUPI, payment.getAmount());
            addAmount(payeeUPI,payment.getAmount());
            status = "SUCCESS";
        } else {
            status = "FAILED";
        }

        PaymentDto response = new PaymentDto();
        response.setRequestId(payment.getRequestId());
        response.setFromVpa(payerUPI);
        response.setToVpa(payeeUPI);
        response.setAmount(payment.getAmount());
        response.setStatus(status);

        kafkaTemplate.send("payment-responses",response);
    }

}
