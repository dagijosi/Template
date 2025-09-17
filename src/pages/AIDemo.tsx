import { Select } from "@/common/ui/Select";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCpu,
  FiSend,
  FiTrash2,
  FiUser,
  FiLoader,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { Button } from "@/common/ui/Button";
import { Textarea } from "@/common/ui/Textarea";
import { useAIMutation } from "@/queries/useAIMutation";
import { useChatStore, type Message } from "@/store/useChatStore";
import { cn } from "@/utils/cn";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism";

// CopyButton Component
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
    >
      {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}{" "}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

// Markdown renderer with syntax highlighting and copy
const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <div className="bg-gray-800 rounded-md my-4 font-mono overflow-hidden">
        <div className="flex items-center justify-between px-4 py-1 bg-gray-700 text-xs text-gray-400">
          <span>{match[1]}</span>
          <CopyButton text={String(children).trim()} />
        </div>
        <SyntaxHighlighter
          language={match[1]}
          style={oneDark}
          customStyle={{ margin: 0, padding: "1rem" }}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code
        className={cn(
          className,
          "bg-gray-700 text-red-400 rounded-sm px-1 py-0.5 text-xs font-mono"
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
};

// Auto-detect if text looks like research
const isLongResearchText = (text: string) => {
  return text.length > 300 && !/```|\n\s*[-*]|^#{1,3}\s/m.test(text);
};

const AIDemo: React.FC = () => {
  const { messages, addMessage, clearMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedModel, setSelectedModel] = useState<
    | "gemini-pro"
    | "gemini-pro-vision"
    | "gemini-2.5-flash"
    | "gemini-2.5-flash-lite"
  >("gemini-2.5-flash");
  const [optionsAreLoading, setOptionsAreLoading] = useState(true);

  const { register, handleSubmit, reset, setFocus } = useForm<{
    message: string;
  }>({
    defaultValues: { message: "" },
  });

  const { mutate, isPending } = useAIMutation(selectedModel);

  const onSubmit = (data: { message: string }) => {
    if (!data.message.trim()) return;
    addMessage({ text: data.message, sender: "user" });
    mutate(data.message);
    reset();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setOptionsAreLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => setFocus("message"), [setFocus]);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] bg-gray-900 text-gray-300 font-sans border border-gray-700 shadow-2xl">
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <FiCpu className="text-blue-400" />
          <span className="font-semibold text-white">AI Assistant</span>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedModel}
            onChange={(e) =>
              setSelectedModel(
                e.target.value as
                  | "gemini-pro"
                  | "gemini-pro-vision"
                  | "gemini-2.5-flash"
                  | "gemini-2.5-flash-lite"
              )
            }
            icon={<FiCpu />}
            optionsLoading={optionsAreLoading}
            loadingOptionText="Loading Models..."
            className="bg-gray-800 border-gray-600 text-white text-xs hover:bg-gray-700 hover:text-white rounded-md"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
            <option value="gemini-pro">Gemini Pro</option>
            <option value="gemini-pro-vision">Gemini Pro Vision</option>
          </Select>
          <Button
            type="button"
            onClick={clearMessages}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
            aria-label="Clear Chat"
          >
            <FiTrash2 />
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-500 mt-8"
            >
              <FiCpu className="mx-auto text-5xl mb-4 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-400">Gemini AI</h2>
              <p className="text-sm">Start the conversation by typing below.</p>
            </motion.div>
          ) : (
            messages.map((msg: Message) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-start gap-4",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender === "ai" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-gray-700 text-gray-300">
                    <FiCpu />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] p-3 rounded-lg text-sm leading-relaxed",
                    msg.sender === "user"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-gray-800 text-gray-200"
                  )}
                >
                  {isLongResearchText(msg.text) ? (
                    <div className="bg-gray-900 border border-gray-700 rounded-md p-3 relative">
                      <div className="absolute top-2 right-2">
                        <CopyButton text={msg.text} />
                      </div>
                      <p className="whitespace-pre-wrap text-gray-300 text-sm">
                        {msg.text}
                      </p>
                    </div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
                {msg.sender === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-blue-500/20 text-blue-400">
                    <FiUser />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-gray-700 text-gray-300">
              <FiCpu />
            </div>
            <div className="flex-1 pt-2 flex items-center gap-2">
              <FiLoader className="animate-spin text-blue-400" />
              <span className="text-sm text-gray-400 animate-pulse">
                AI is thinking...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <footer className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <Textarea
            {...register("message")}
            placeholder="Ask anything or type a command... (Shift + Enter for new line)"
            autoComplete="off"
            rows={1}
            className="w-full max-h-40 bg-gray-800 border-gray-700 rounded-lg font-mono text-sm resize-none pr-12 py-3 custom-scrollbar"
            disabled={isPending}
            onInput={(e) => {
              const textarea = e.currentTarget;
              textarea.style.height = "auto";
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          />
          <Button
            type="submit"
            disabled={isPending}
            size="icon"
            variant="ghost"
            className="absolute right-3 bottom-3 text-gray-400 hover:text-blue-400"
            aria-label="Send Message"
          >
            <FiSend />
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default AIDemo;
