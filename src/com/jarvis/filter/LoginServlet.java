package com.jarvis.filter;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class LoginServlet
 */

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String userName = request.getParameter("userName");
		String password = request.getParameter("password");

		System.out.println("user name is: " + userName);

		if (userName.equals("user") && password.equals("password")) {
			System.out.println("authenticated");
			HttpSession session = request.getSession();
			session.setAttribute("user", userName);
			response.sendRedirect("home.jsp");
		} else {
			System.out.println("wrong credentials");
			response.sendRedirect("login.html");
		}
	}

}
