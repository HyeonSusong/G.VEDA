package net.veda;

import java.net.http.HttpRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MainController {
	
	@RequestMapping(value = "/home")
	public String mainreturn(Model model) {
		String url = "hello.html";
		return url;
	}
	
	@RequestMapping(value = "/")
	public String mainreturn2(Model model) {
		String url = "/home";
		return url;
	}
	
}
