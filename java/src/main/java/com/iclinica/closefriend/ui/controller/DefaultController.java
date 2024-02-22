package com.iclinica.closefriend.ui.controller;


import com.iclinica.closefriend.core.dto.Tuple3;
import com.iclinica.closefriend.ui.service.IFileService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Controller
@Slf4j
public class DefaultController {

    @Autowired
    private IFileService fileService;

    @GetMapping(path = "/**")
    public void defaultIndex(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String resourceLocation = "classpath:public" + (request.getRequestURI().contains(".") ? request.getRequestURI() : "/index.html");
        Tuple3<byte[], Long, String> tuple3 = fileService.getFile(resourceLocation);
        response.setHeader("Content-Disposition", String.format("inline; filename= %s", tuple3.getT3()));
        String extension = FilenameUtils.getExtension(resourceLocation);
        if (extension.contains(".css") || extension.contains(".js") || extension.contains("html")) {
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("Pragma", "no-cache");
            response.setHeader("Expires", "0");
        } else {
            response.setHeader("Cache-Control", "public, max-age=172800, immutable");
        }
        response.setContentLengthLong(tuple3.getT2());
        response.setContentType(tuple3.getT3());
        ServletOutputStream os = response.getOutputStream();
        try {
            byte[] t1 = tuple3.getT1();
            os.write(t1, 0, t1.length);
        } finally {
            os.close();
        }
        response.flushBuffer();
    }


}
