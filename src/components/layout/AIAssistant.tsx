"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
        { role: 'ai', text: "Hello! I'm your Institute AI Assistant. Need help setting up classes, managing attendance, or creating a lesson plan?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', text: input }]);
        setInput("");

        // Mock AI Response
        setTimeout(() => {
            const responses = [
                "I can help with that! Let's navigate to the Classes section.",
                "To set up a quiz, go to the Teacher Dashboard inside the Subject view.",
                "Seat utilization is currently at 78%. We might need another hall for O/L Maths.",
                "Generating a lesson plan for 'Newton's Laws'... Done! Check your Documents."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { role: 'ai', text: randomResponse }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
            {isOpen && (
                <GlassCard className="w-80 md:w-96 flex flex-col h-[500px] border-b2u-cyan/50 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-b2u-blue/10">
                        <div className="flex items-center gap-2">
                            <div className="bg-b2u-cyan/20 p-2 rounded-full">
                                <Bot size={20} className="text-b2u-cyan" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Tuition AI</h3>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-full" onClick={() => setIsOpen(false)}>
                            <X size={16} />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                        ? 'bg-b2u-blue text-white rounded-tr-none'
                                        : 'bg-white/10 backdrop-blur-md border border-white/10 text-foreground rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t border-white/10 bg-black/5">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask AI anything..."
                                className="bg-white/5 border-white/10 focus-visible:ring-b2u-cyan/50"
                            />
                            <Button type="submit" size="icon" variant="animated" className="shrink-0 h-10 w-10">
                                <Send size={16} />
                            </Button>
                        </form>
                    </div>
                </GlassCard>
            )}

            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="animated"
                className="h-14 w-14 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 bg-gradient-to-r from-b2u-blue via-b2u-cyan to-b2u-teal"
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
            </Button>
        </div>
    );
}
