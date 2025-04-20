// MODULES //
import { Component } from '@angular/core';

// SERVICES //
import { ChatbotService } from '../services/chatbot.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent {
   userDeptId: string = '';
  userDepartment: string = '';
  userMessage: string = '';
  chatHistory: { sender: string; message: string; loading?: boolean }[] = [];
  botVisible: boolean = false;
  isLoading: boolean = false;
  isDeptCodeVerified: boolean = false;
  userDeptCode: string = '';


  constructor(private chatbotService: ChatbotService, private cookieService: CookieService) {}

 ngOnInit() {
    this.userDeptId = this.cookieService.get('user_id'); 

 
 }



  toggleBot() {
  this.botVisible = !this.botVisible;

  if (this.botVisible && !this.isDeptCodeVerified) {
    this.userDeptId = this.cookieService.get('user_id'); 

    console.log('Dept ID from Cookie:', this.userDeptId); 


    const departmentMap: { [key: string]: string } = {
      '1': 'Defense Department',
      '2': 'Home Affairs Department',
      '3': 'Health Department',
      '4': 'Education Department',
      '5': 'Infrastructure Department',
      '6': 'Agriculture Department',
      '7': 'Rural Development Department',
      '8': 'Urban Development Department',
      '9': 'Energy Department',
      '10': 'Transport Department',
    };
    
    this.userDepartment = departmentMap[this.userDeptId] || 'Unknown Department';

    this.chatHistory.push({
      sender: 'bot',
      message: `Welcome ${this.userDepartment} chatbot! How can I assist you today?`,
    });

    this.isDeptCodeVerified = true;
  }
}


  sendMessage() {
    if (this.userMessage.trim()) {
      this.chatHistory.push({ sender: 'user', message: this.userMessage });

      if (!this.isDeptCodeVerified) {
        this.verifyDepartmentCode(this.userMessage);
      } else {
        this.handleBotResponse(this.userMessage);
      }

      this.userMessage = '';
    }
  }

  verifyDepartmentCode(deptCode: string) {
    this.isLoading = true;
    this.chatHistory.push({ sender: 'bot', message: '', loading: true });

    this.chatbotService.validateDepartmentCode(deptCode).subscribe(
      (response) => {
        if (response.valid) {
          this.isDeptCodeVerified = true;
          this.userDeptCode = deptCode;
          this.userDepartment = response.departmentName || '';

          this.chatHistory[this.chatHistory.length - 1] = {
            sender: 'bot',
            message:
              response.message || 'Department code verified successfully!',
          };
        } else {
          this.chatHistory[this.chatHistory.length - 1] = {
            sender: 'bot',
            message:
              response.message || 'Invalid department code. Please try again.',
          };
        }
        this.isLoading = false;
      },
      (error) => {
        this.chatHistory[this.chatHistory.length - 1] = {
          sender: 'bot',
          message:
            'An error occurred while verifying department code. Try again.',
        };
        this.isLoading = false;
      }
    );
  }

  handleBotResponse(message: string) {
    this.isLoading = true;
    this.chatHistory.push({ sender: 'bot', message: '', loading: true });

    this.chatbotService.getResponse(message, this.userDepartment).subscribe(
      (response) => {
        console.log('Bot Response Received:', response);

        if (!response) {
          response = 'No response received.';
        }

        if (typeof response !== 'string') {
          response = JSON.stringify(response, null, 2);
        }

        if (response.includes('Fetching projects...')) {
          this.fetchProjectsForDepartment();
          return;
        }

        let formattedResponse = this.formatResponse(response);

        this.chatHistory[this.chatHistory.length - 1] = {
          sender: 'bot',
          message: formattedResponse,
        };

        this.isLoading = false;
      },
      (error) => {
        console.error('Chatbot Error:', error);

        this.chatHistory[this.chatHistory.length - 1] = {
          sender: 'bot',
          message: 'An error occurred. Please try again later.',
        };

        this.isLoading = false;
      }
    );
  }




  fetchProjectsForDepartment() {
    this.isLoading = true;
    this.chatHistory.push({
      sender: 'bot',
      message: 'Fetching project details...',
      loading: true,
    });

    this.chatbotService.fetchProjectsFromBackend(this.userDepartment).subscribe(
      (projectData) => {
        console.log('Project Data Received:', projectData);

        this.chatHistory[this.chatHistory.length - 1] = {
          sender: 'bot',
          message: this.formatResponse(projectData),
        };

        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching projects:', error);

        this.chatHistory[this.chatHistory.length - 1] = {
          sender: 'bot',
          message: 'Could not fetch project details. Try again later.',
        };

        this.isLoading = false;
      }
    );
  }

  formatResponse(response: string): string {
    if (typeof response !== 'string') {
      console.warn('formatResponse received non-string:', response);
      return 'Unexpected response format. Please try again.';
    }

    return response
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>');
  }
}












