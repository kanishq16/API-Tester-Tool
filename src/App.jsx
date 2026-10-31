import { useEffect, useState } from "react";
import Tabs from "./components/Tabs.jsx";
import HeadersEditor from "./components/HeadersEditor.jsx";
import AuthEditor from "./components/AuthEditor.jsx";
import ResponseViewer from "./components/ResponseViewer.jsx";
import History from "./components/History.jsx";
import { METHODS, buildRequest, toCurl, loadHistory, saveHistory } from "./utils.js";

export default function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState([{ k: "Accept", v: "application/json" }]);
  const [body, setBody] = useState("");
  const [auth, setAuth] = useState({ type: "", a: "", b: "" });
  const [reqTab, setReqTab] = useState("Headers");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [curlLabel, setCurlLabel] = useState("Copy as cURL");
}