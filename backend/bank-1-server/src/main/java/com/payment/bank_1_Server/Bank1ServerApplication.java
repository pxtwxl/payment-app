package com.payment.bank_1_Server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class Bank1ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(Bank1ServerApplication.class, args);
	}

}
